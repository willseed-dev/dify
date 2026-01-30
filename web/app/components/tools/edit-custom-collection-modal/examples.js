"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const examples = [
    {
        key: 'json',
        content: `{
      "openapi": "3.1.0",
      "info": {
        "title": "Get weather data",
        "description": "Retrieves current weather data for a location.",
        "version": "v1.0.0"
      },
      "servers": [
        {
          "url": "https://weather.example.com"
        }
      ],
      "paths": {
        "/location": {
          "get": {
            "description": "Get temperature for a specific location",
            "operationId": "GetCurrentWeather",
            "parameters": [
              {
                "name": "location",
                "in": "query",
                "description": "The city and state to retrieve the weather for",
                "required": true,
                "schema": {
                  "type": "string"
                }
              }
            ],
            "deprecated": false
          }
        }
      },
      "components": {
        "schemas": {}
      }
    }`,
    },
    {
        key: 'yaml',
        content: `# Taken from https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore.yaml

    openapi: "3.0.0"
    info:
      version: 1.0.0
      title: Swagger Petstore
      license:
        name: MIT
    servers:
      - url: https://petstore.swagger.io/v1
    paths:
      /pets:
        get:
          summary: List all pets
          operationId: listPets
          tags:
            - pets
          parameters:
            - name: limit
              in: query
              description: How many items to return at one time (max 100)
              required: false
              schema:
                type: integer
                maximum: 100
                format: int32
          responses:
            '200':
              description: A paged array of pets
              headers:
                x-next:
                  description: A link to the next page of responses
                  schema:
                    type: string
              content:
                application/json:
                  schema:
                    $ref: "#/components/schemas/Pets"
            default:
              description: unexpected error
              content:
                application/json:
                  schema:
                    $ref: "#/components/schemas/Error"
        post:
          summary: Create a pet
          operationId: createPets
          tags:
            - pets
          responses:
            '201':
              description: Null response
            default:
              description: unexpected error
              content:
                application/json:
                  schema:
                    $ref: "#/components/schemas/Error"
      /pets/{petId}:
        get:
          summary: Info for a specific pet
          operationId: showPetById
          tags:
            - pets
          parameters:
            - name: petId
              in: path
              required: true
              description: The id of the pet to retrieve
              schema:
                type: string
          responses:
            '200':
              description: Expected response to a valid request
              content:
                application/json:
                  schema:
                    $ref: "#/components/schemas/Pet"
            default:
              description: unexpected error
              content:
                application/json:
                  schema:
                    $ref: "#/components/schemas/Error"
    components:
      schemas:
        Pet:
          type: object
          required:
            - id
            - name
          properties:
            id:
              type: integer
              format: int64
            name:
              type: string
            tag:
              type: string
        Pets:
          type: array
          maxItems: 100
          items:
            $ref: "#/components/schemas/Pet"
        Error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: integer
              format: int32
            message:
              type: string`,
    },
    {
        key: 'blankTemplate',
        content: `{
      "openapi": "3.1.0",
      "info": {
        "title": "Untitled",
        "description": "Your OpenAPI specification",
        "version": "v1.0.0"
      },
      "servers": [
        {
          "url": ""
        }
      ],
      "paths": {},
      "components": {
        "schemas": {}
      }
    }`,
    },
];
exports.default = examples;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleGFtcGxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sUUFBUSxHQUFHO0lBQ2Y7UUFDRSxHQUFHLEVBQUUsTUFBTTtRQUNYLE9BQU8sRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFtQ1A7S0FDSDtJQUNEO1FBQ0UsR0FBRyxFQUFFLE1BQU07UUFDWCxPQUFPLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFrSGM7S0FDeEI7SUFDRDtRQUNFLEdBQUcsRUFBRSxlQUFlO1FBQ3BCLE9BQU8sRUFBRTs7Ozs7Ozs7Ozs7Ozs7OztNQWdCUDtLQUNIO0NBQ08sQ0FBQTtBQUVWLGtCQUFlLFFBQVEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGV4YW1wbGVzID0gW1xuICB7XG4gICAga2V5OiAnanNvbicsXG4gICAgY29udGVudDogYHtcbiAgICAgIFwib3BlbmFwaVwiOiBcIjMuMS4wXCIsXG4gICAgICBcImluZm9cIjoge1xuICAgICAgICBcInRpdGxlXCI6IFwiR2V0IHdlYXRoZXIgZGF0YVwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiUmV0cmlldmVzIGN1cnJlbnQgd2VhdGhlciBkYXRhIGZvciBhIGxvY2F0aW9uLlwiLFxuICAgICAgICBcInZlcnNpb25cIjogXCJ2MS4wLjBcIlxuICAgICAgfSxcbiAgICAgIFwic2VydmVyc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcInVybFwiOiBcImh0dHBzOi8vd2VhdGhlci5leGFtcGxlLmNvbVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBcInBhdGhzXCI6IHtcbiAgICAgICAgXCIvbG9jYXRpb25cIjoge1xuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZXQgdGVtcGVyYXR1cmUgZm9yIGEgc3BlY2lmaWMgbG9jYXRpb25cIixcbiAgICAgICAgICAgIFwib3BlcmF0aW9uSWRcIjogXCJHZXRDdXJyZW50V2VhdGhlclwiLFxuICAgICAgICAgICAgXCJwYXJhbWV0ZXJzXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImxvY2F0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJpblwiOiBcInF1ZXJ5XCIsXG4gICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlRoZSBjaXR5IGFuZCBzdGF0ZSB0byByZXRyaWV2ZSB0aGUgd2VhdGhlciBmb3JcIixcbiAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJzY2hlbWFcIjoge1xuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImRlcHJlY2F0ZWRcIjogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImNvbXBvbmVudHNcIjoge1xuICAgICAgICBcInNjaGVtYXNcIjoge31cbiAgICAgIH1cbiAgICB9YCxcbiAgfSxcbiAge1xuICAgIGtleTogJ3lhbWwnLFxuICAgIGNvbnRlbnQ6IGAjIFRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL09BSS9PcGVuQVBJLVNwZWNpZmljYXRpb24vYmxvYi9tYWluL2V4YW1wbGVzL3YzLjAvcGV0c3RvcmUueWFtbFxuXG4gICAgb3BlbmFwaTogXCIzLjAuMFwiXG4gICAgaW5mbzpcbiAgICAgIHZlcnNpb246IDEuMC4wXG4gICAgICB0aXRsZTogU3dhZ2dlciBQZXRzdG9yZVxuICAgICAgbGljZW5zZTpcbiAgICAgICAgbmFtZTogTUlUXG4gICAgc2VydmVyczpcbiAgICAgIC0gdXJsOiBodHRwczovL3BldHN0b3JlLnN3YWdnZXIuaW8vdjFcbiAgICBwYXRoczpcbiAgICAgIC9wZXRzOlxuICAgICAgICBnZXQ6XG4gICAgICAgICAgc3VtbWFyeTogTGlzdCBhbGwgcGV0c1xuICAgICAgICAgIG9wZXJhdGlvbklkOiBsaXN0UGV0c1xuICAgICAgICAgIHRhZ3M6XG4gICAgICAgICAgICAtIHBldHNcbiAgICAgICAgICBwYXJhbWV0ZXJzOlxuICAgICAgICAgICAgLSBuYW1lOiBsaW1pdFxuICAgICAgICAgICAgICBpbjogcXVlcnlcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IEhvdyBtYW55IGl0ZW1zIHRvIHJldHVybiBhdCBvbmUgdGltZSAobWF4IDEwMClcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICAgICAgICAgIHNjaGVtYTpcbiAgICAgICAgICAgICAgICB0eXBlOiBpbnRlZ2VyXG4gICAgICAgICAgICAgICAgbWF4aW11bTogMTAwXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBpbnQzMlxuICAgICAgICAgIHJlc3BvbnNlczpcbiAgICAgICAgICAgICcyMDAnOlxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogQSBwYWdlZCBhcnJheSBvZiBwZXRzXG4gICAgICAgICAgICAgIGhlYWRlcnM6XG4gICAgICAgICAgICAgICAgeC1uZXh0OlxuICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IEEgbGluayB0byB0aGUgbmV4dCBwYWdlIG9mIHJlc3BvbnNlc1xuICAgICAgICAgICAgICAgICAgc2NoZW1hOlxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBzdHJpbmdcbiAgICAgICAgICAgICAgY29udGVudDpcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbi9qc29uOlxuICAgICAgICAgICAgICAgICAgc2NoZW1hOlxuICAgICAgICAgICAgICAgICAgICAkcmVmOiBcIiMvY29tcG9uZW50cy9zY2hlbWFzL1BldHNcIlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZXhwZWN0ZWQgZXJyb3JcbiAgICAgICAgICAgICAgY29udGVudDpcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbi9qc29uOlxuICAgICAgICAgICAgICAgICAgc2NoZW1hOlxuICAgICAgICAgICAgICAgICAgICAkcmVmOiBcIiMvY29tcG9uZW50cy9zY2hlbWFzL0Vycm9yXCJcbiAgICAgICAgcG9zdDpcbiAgICAgICAgICBzdW1tYXJ5OiBDcmVhdGUgYSBwZXRcbiAgICAgICAgICBvcGVyYXRpb25JZDogY3JlYXRlUGV0c1xuICAgICAgICAgIHRhZ3M6XG4gICAgICAgICAgICAtIHBldHNcbiAgICAgICAgICByZXNwb25zZXM6XG4gICAgICAgICAgICAnMjAxJzpcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IE51bGwgcmVzcG9uc2VcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmV4cGVjdGVkIGVycm9yXG4gICAgICAgICAgICAgIGNvbnRlbnQ6XG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb24vanNvbjpcbiAgICAgICAgICAgICAgICAgIHNjaGVtYTpcbiAgICAgICAgICAgICAgICAgICAgJHJlZjogXCIjL2NvbXBvbmVudHMvc2NoZW1hcy9FcnJvclwiXG4gICAgICAvcGV0cy97cGV0SWR9OlxuICAgICAgICBnZXQ6XG4gICAgICAgICAgc3VtbWFyeTogSW5mbyBmb3IgYSBzcGVjaWZpYyBwZXRcbiAgICAgICAgICBvcGVyYXRpb25JZDogc2hvd1BldEJ5SWRcbiAgICAgICAgICB0YWdzOlxuICAgICAgICAgICAgLSBwZXRzXG4gICAgICAgICAgcGFyYW1ldGVyczpcbiAgICAgICAgICAgIC0gbmFtZTogcGV0SWRcbiAgICAgICAgICAgICAgaW46IHBhdGhcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFRoZSBpZCBvZiB0aGUgcGV0IHRvIHJldHJpZXZlXG4gICAgICAgICAgICAgIHNjaGVtYTpcbiAgICAgICAgICAgICAgICB0eXBlOiBzdHJpbmdcbiAgICAgICAgICByZXNwb25zZXM6XG4gICAgICAgICAgICAnMjAwJzpcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IEV4cGVjdGVkIHJlc3BvbnNlIHRvIGEgdmFsaWQgcmVxdWVzdFxuICAgICAgICAgICAgICBjb250ZW50OlxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uL2pzb246XG4gICAgICAgICAgICAgICAgICBzY2hlbWE6XG4gICAgICAgICAgICAgICAgICAgICRyZWY6IFwiIy9jb21wb25lbnRzL3NjaGVtYXMvUGV0XCJcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmV4cGVjdGVkIGVycm9yXG4gICAgICAgICAgICAgIGNvbnRlbnQ6XG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb24vanNvbjpcbiAgICAgICAgICAgICAgICAgIHNjaGVtYTpcbiAgICAgICAgICAgICAgICAgICAgJHJlZjogXCIjL2NvbXBvbmVudHMvc2NoZW1hcy9FcnJvclwiXG4gICAgY29tcG9uZW50czpcbiAgICAgIHNjaGVtYXM6XG4gICAgICAgIFBldDpcbiAgICAgICAgICB0eXBlOiBvYmplY3RcbiAgICAgICAgICByZXF1aXJlZDpcbiAgICAgICAgICAgIC0gaWRcbiAgICAgICAgICAgIC0gbmFtZVxuICAgICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgICBpZDpcbiAgICAgICAgICAgICAgdHlwZTogaW50ZWdlclxuICAgICAgICAgICAgICBmb3JtYXQ6IGludDY0XG4gICAgICAgICAgICBuYW1lOlxuICAgICAgICAgICAgICB0eXBlOiBzdHJpbmdcbiAgICAgICAgICAgIHRhZzpcbiAgICAgICAgICAgICAgdHlwZTogc3RyaW5nXG4gICAgICAgIFBldHM6XG4gICAgICAgICAgdHlwZTogYXJyYXlcbiAgICAgICAgICBtYXhJdGVtczogMTAwXG4gICAgICAgICAgaXRlbXM6XG4gICAgICAgICAgICAkcmVmOiBcIiMvY29tcG9uZW50cy9zY2hlbWFzL1BldFwiXG4gICAgICAgIEVycm9yOlxuICAgICAgICAgIHR5cGU6IG9iamVjdFxuICAgICAgICAgIHJlcXVpcmVkOlxuICAgICAgICAgICAgLSBjb2RlXG4gICAgICAgICAgICAtIG1lc3NhZ2VcbiAgICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgY29kZTpcbiAgICAgICAgICAgICAgdHlwZTogaW50ZWdlclxuICAgICAgICAgICAgICBmb3JtYXQ6IGludDMyXG4gICAgICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgICB0eXBlOiBzdHJpbmdgLFxuICB9LFxuICB7XG4gICAga2V5OiAnYmxhbmtUZW1wbGF0ZScsXG4gICAgY29udGVudDogYHtcbiAgICAgIFwib3BlbmFwaVwiOiBcIjMuMS4wXCIsXG4gICAgICBcImluZm9cIjoge1xuICAgICAgICBcInRpdGxlXCI6IFwiVW50aXRsZWRcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIllvdXIgT3BlbkFQSSBzcGVjaWZpY2F0aW9uXCIsXG4gICAgICAgIFwidmVyc2lvblwiOiBcInYxLjAuMFwiXG4gICAgICB9LFxuICAgICAgXCJzZXJ2ZXJzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwidXJsXCI6IFwiXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFwicGF0aHNcIjoge30sXG4gICAgICBcImNvbXBvbmVudHNcIjoge1xuICAgICAgICBcInNjaGVtYXNcIjoge31cbiAgICAgIH1cbiAgICB9YCxcbiAgfSxcbl0gYXMgY29uc3RcblxuZXhwb3J0IGRlZmF1bHQgZXhhbXBsZXNcbiJdfQ==