import { ThemedText } from '@/components/ThemedText';
import { useEffect, useRef, useState } from 'react';
import { PixelRatio, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Expo2DContext, { Expo2dContextOptions } from 'expo-2d-context';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';

export default function Test() {
    const ctxRef = useRef<Expo2DContext | null>(null);
    const pixelRatio = PixelRatio.get();

    const [data, setData] = useState<{ [key: string]: any } | null>(null);
    const [roads, setRoads] = useState<any[] | null>(null);

    const bounds = '53.76,20.48,53.77,20.49'.split(',').map((e) => parseFloat(e));

    async function getRoadData() {
        const query = `
            [out:json];
            way[highway](${bounds.join(', ')});
            out geom;
        `;

        const url = 'https://overpass-api.de/api/interpreter';
        const res = await fetch(url, {
            method: 'POST',
            body: query
        });

        if (!res.ok) throw new Error(`Overpass API error: ${JSON.stringify(res)}`);
        const data = await res.json();
        setData(data);
        return data;
    }

    useEffect(() => {
        if (data === null) return;

        setRoads((p) => [
            ...data.elements.map((element: any) => {
                const positions: { x: number; y: number }[] = [];
                element.geometry.forEach((e: any, idx: number) => {
                    const { x, y } = project(e.lon, e.lat);

                    positions.push({ x, y });
                });
                return positions;
            })
        ]);
    }, [data]);

    useEffect(() => {
        draw();
    }, [roads]);

    function context(gl: ExpoWebGLRenderingContext) {
        const c = new Expo2DContext(gl as unknown as number, undefined as unknown as Expo2dContextOptions);
        ctxRef.current = c;

        draw();
    }

    function draw() {
        const c = ctxRef.current;
        if (c === null || !roads) return;

        // console.log(roads.length);

        c.fillStyle = '#333';
        c.clearRect(0, 0, c.width, c.height);

        c.strokeStyle = '#fff';
        c.lineWidth = 2;

        roads.forEach((poses: any) => {
            let index = 0;
            c.beginPath();
            for (let pos of poses) {
                const { x, y } = pos;

                if (index === 0) c.moveTo(x, y);
                else c.lineTo(x, y);

                index++;
            }
            c.stroke();
            c.closePath();
        });

        c.flush();
    }

    function project(lon: number, lat: number) {
        if (!ctxRef.current) return { x: 0, y: 0 };
        const width = ctxRef.current.width;
        const height = ctxRef.current.height;

        const x = ((lon - bounds[1]) / (bounds[3] - bounds[1])) * width;
        const y = height - ((lat - bounds[0]) / (bounds[2] - bounds[0])) * height;
        return { x, y };
    }

    return (
        <SafeAreaView style={[{ backgroundColor: '#333', height: '100%' }]}>
            <TouchableOpacity onPress={getRoadData}>
                <ThemedText>GET</ThemedText>
            </TouchableOpacity>
            <GLView
                style={{ width: 200, height: 200, borderColor: '#fff', borderWidth: 1 }}
                onContextCreate={context}
                onStartShouldSetResponder={() => true}
            />
        </SafeAreaView>
    );
}
