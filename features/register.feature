Feature: Register API

    Rule: Positive registration

        Scenario: Successful registration
            Given I have valid credentials:
            """
            {
                "email": "eve.holt@reqres.in",
                "password": "cityslicka"
            }
            """
            When I register
            Then the response status code should be 200
            And the response should contain property "id"
            And the response should contain property "token"

        Scenario: Register user and reuse returned id
            Given I have valid credentials:
            """
            {
                "email": "eve.holt@reqres.in",
                "password": "cityslicka"
            }
            """
            When I register
            Then the response status code should be 200
            And I store the returned user id
            When I request user with id 2
            Then the response status code should be 200
            And the response should contain user id 2

        Scenario: Get users with query parameter
            Given I set query parameters:
                | page | 2 |
            When I send a GET request to "/users"
            Then the response status code should be 200
            And JSONPath "$.data[*].id" should have length 6


        Scenario: Validate users response schema
            Given I set query parameters:
                | page | 2 |
            When I send a GET request to "/users"
            Then the response status code should be 200
            And the response should match JSON schema:
                """
                {
                "type": "object",
                "properties": {
                    "page": { "type": "integer" },
                    "per_page": { "type": "integer" },
                    "total": { "type": "integer" },
                    "total_pages": { "type": "integer" },
                    "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                        "id": { "type": "integer" },
                        "email": { "type": "string" },
                        "first_name": { "type": "string" },
                        "last_name": { "type": "string" },
                        "avatar": { "type": "string" }
                        },
                        "required": ["id", "email", "first_name", "last_name", "avatar"]
                    }
                    }
                },
                "required": ["page", "per_page", "total", "total_pages", "data"]
                }
                """

        Scenario: Validate users response schema
            Given I set query parameters:
                | page | 2 |
            When I send a GET request to "/users"
            Then the response status code should be 200
            And the response should match schema "users"


            Scenario: Validate a specific value with JSONPath
                When I send a GET request to "/users/2"
                Then the response status code should be 200
                And JSONPath "$.data.id" should equal number 2
                And JSONPath "$.data.email" should equal string "janet.weaver@reqres.in"

            
        Scenario: Validate ids list
            Given I set query parameters:
                | page | 2 |
            When I send a GET request to "/users"
            Then the response status code should be 200
            And JSONPath "$.data[*].id" should include numbers:
                | 7 |
                | 8 |

        Scenario: Validate emails list
            Given I set query parameters:
                | page | 2 |
            When I send a GET request to "/users"
            Then the response status code should be 200
            And JSONPath "$.data[*].email" should include strings:
                | michael.lawson@reqres.in |
                | lindsay.ferguson@reqres.in |


        Scenario: Set bearer token before request
            Given I set bearer token "fake-token-123"
            When I send a GET request to "/users/2"
            Then the response status code should be 200

        Scenario: Validate users response
            Given I set query parameters:
                | page | 2 |
            When I send a GET request to "/users"
            Then the response status code should be 200
            And the response should match schema "users"

        Scenario: Validate each user item
            Given I set query parameters:
                | page | 2 |
            When I send a GET request to "/users"
            Then the response status code should be 200
            And JSONPath "$.data[*]" should match schema "user-item"


    Rule: Negative registration

        Scenario: Registration with missing password
            Given I have registration credentials without password
            When I register
            Then the response status code should be 400
            And the response should contain property "error"

        
        Scenario: Registration without API key in header
            Given I dont have API key in header
            When I register
            Then the response status code should be 403