Feature: wrapper

  Scenario: High-level Scaffold
    Given nvm is properly configured
    And the npm cli is logged in
    And the project should be versioned in git
    When the high-level scaffolder is executed
    Then the proper form8ion config is extended
    And dependencies are installed
