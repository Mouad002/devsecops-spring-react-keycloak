import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: "devsecops-realm",
    clientId: "react-client",
});

export default keycloak;
