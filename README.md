# rfc-connector

Simple Express JS Server to expose the ABAP Development Tools Webservice on localhost through the RFC Gateway. Requires the SAP NetWeaver RFC SDK (SAPNWRFC SDK) to function.

## Obtaining the SAP NetWeaver RFC SDK

To use this connector, you need the SAP NetWeaver RFC SDK. This SDK is proprietary software provided by SAP and is necessary for communication with SAP systems using Remote Function Calls (RFC).

### Steps to Obtain the SDK

1. **Contact Your SAP Basis Team**: The SDK is typically managed by the SAP Basis team within your organization. Reach out to them and request access to the SAP NetWeaver RFC SDK. They can provide you with the necessary files and ensure you have the appropriate permissions.

2. **Download from SAP Support Portal**:

   - Visit the [SAP Support Portal](https://support.sap.com).
   - Log in with your SAP S-User ID. If you don't have one, your SAP administrator can help you obtain it.
   - Navigate to **Software Downloads** > **Support Packages and Patches**.
   - Search for **"SAP NW RFC SDK"**.
   - Select the version that matches your system's architecture and download it.

3. **Installation**:

   - Follow the installation instructions provided in the SDK's documentation.
   - Ensure that the SDK's libraries are accessible in your system's environment variables (e.g., `PATH` on Windows or `LD_LIBRARY_PATH` on Unix/Linux).

### Important Notes

- **Licensing**: The SAP NetWeaver RFC SDK is subject to SAP's licensing agreements. Make sure you comply with all licensing requirements when using the SDK.
- **Compatibility**: Ensure that the version of the SDK you download is compatible with your SAP system and the environment where the connector will run.
- **Support**: For any issues related to the SDK, refer to SAP's official documentation or contact SAP support through the [SAP Support Portal](https://support.sap.com).

## Getting Started with the Connector

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run the Server**:

   ```bash
   node index.js
   ```

3. **Configure Connection Parameters**:

   - Upon starting, the server will prompt you for SAP connection details such as username, password, system number (`sysnr`), client, and application server host (`ashost`).
   - Ensure that the user credentials you provide have the necessary permissions to access the required RFC functions.

## Usage

- The connector listens on port `1080` by default.
- It exposes the ABAP Development Tools Webservice via HTTP methods like GET, POST, and PUT.
- You can interact with the service using tools like `curl` or by integrating it into your applications.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes or enhancements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
