pnpm openapi-generator-cli generate \
    -i http://localhost:8000/api-docs/openapi.json \
    -g typescript-fetch \
    -o ./src/lib/api-client \
    --skip-validate-spec

if [ $? -ne 0 ]; then
    echo "-------------------------------------------------------------"
    echo ""
    echo "\033[0;31m"
    echo "Error: OpenAPI generation failed."
    echo "Make sure that the OpenAPI server is running and accessible at http://localhost:8000/api-docs/openapi.json"
    echo "You can start the server with 'pnpm run dev'."
    echo "\033[0m"
    echo ""
    exit 1
fi