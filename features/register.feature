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