



{
    "presets": [
        [
            "@babel/env",
            {
                "useBuiltIns":"usage"
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true
            }
        ],
        [
            "@babel/plugin-proposal-class-properties",
            {
                "loose": true
            }
        ],
        "idx",
        "codegen"
    ],
    "minified":true,
    "auxiliaryCommentBefore":"好好学习"
}