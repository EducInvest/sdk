import { VerifySDK } from './public/VerifySDK/VerifySDK.js';

const DeviceKeyIdentifier = 'dtjOuSYP3LYx7QdcoD065J83HNErIlN3';
const tenantId = '80f19ab2-7af0-4bdc-9542-1a4c2d32918b';
const ApiKey = "sk-DEV-29594928-G070_hPDm9C1UujRbBDfeOTnlqs3KZo6UX0Z0ik6ZgiDudoZW0JOkcaLbk1-2i0J";
const BaseURL = 'https://api.verify-idx.com';

const PublicFaceScanEncryptionKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n' +
  'M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n' +
  'DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n' +
  'mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n' +
  'GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n' +
  'ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n' +
  '8QIDAQAB\n' +
  '-----END PUBLIC KEY-----';

export const setInitialConfig  = () => {
  VerifySDK.InitialConfigurations.BaseURL = BaseURL;
  VerifySDK.InitialConfigurations.TenantId = tenantId;
  VerifySDK.InitialConfigurations.ApiKey = ApiKey;
  VerifySDK.InitialConfigurations.DeviceKeyIdentifier = DeviceKeyIdentifier;
  VerifySDK.InitialConfigurations.PublicFaceScanEncryptionKey = PublicFaceScanEncryptionKey;
}