import { faker } from '@faker-js/faker';

describe("User Testing", () => {
  let baseUrl;
  let appId;

  /*Problems with this test: 
    Since we don't save the random firstName or the random email
    we can lost track of the test users created in the DB

    Next Step: Improve logic so the user is deleted after the test
               or try to find a way to save the emails to be deleted and
               code a script just to delete test users

    Personal Note: move the firstName and email to another place outside of the test
  */
  it("Create user with success", () => {
    cy.fixture("api-variables").as("apiData");

    cy.get("@apiData").then((apiData) => {
      appId = apiData.appId;
    });

    cy.log(baseUrl);

    cy.request({
      method: "POST",
      url: '/user/create',
      headers: {
        'app-id': "6536af521956e10e49c899e2"
      },
      body: {
        firstName: faker.person.firstName(),
        lastName: "Doe",
        email: faker.internet.email(),
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
