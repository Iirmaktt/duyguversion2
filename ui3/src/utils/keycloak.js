import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'Duygu',
  clientId: 'app'
});
export default keycloak