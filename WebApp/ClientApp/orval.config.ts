export default {
    qrtagger: {
        output: {
            mode: "tags-split",
            target: "src/api/client/qrtagger.ts",
            schemas: "src/api/client/model",
            client: "react-query",
            override: {
                mutator: {
                    path: "./src/api/client/customClient.ts",
                    name: "useCustomClient",
                },
            },
        },
        input: {
            target: "src/api/schema/v1/schema.json",
        },
    },
};