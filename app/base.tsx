import useConfig from "@/hooks/useConfig";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Loading from "./loading";

export default function Base() {
    const router = useRouter();
    const config = useConfig();
    const [logged, setLogged] = useState(false);
    const [hasAccount, setHasAccount] = useState(false); // TODO: read from config

    useEffect(() => {
        if (!hasAccount) router.replace("/welcome");
        else router.replace("/map");
    }, [logged]);

    return <>{hasAccount && !logged && <Loading subtitle="Logging in..." />}</>;
}
