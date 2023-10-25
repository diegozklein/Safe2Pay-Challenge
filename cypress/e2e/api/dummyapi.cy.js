import { faker } from "@faker-js/faker";

describe("User Creation Testing", () => {
  let bodyParams = {
    firstName: faker.person.firstName(),
    lastName: "Doe",
    email: faker.internet.email(),
  };
  let generatedFN = bodyParams.firstName;
  let generatedEmail = bodyParams.email;
  /*Problems with this test: 
    Since we don't save the random firstName or the random email
    we can lost track of the test users created in the DB

    The tests are mostly using the response code as a acceptance criteria
    One way to improve the test reliability is to check the BD after the test passes,
    just to make sure that the user really was created, deleted or updated.

    Next Step: Improve logic so the user is deleted after the test
               or try to find a way to save the emails to be deleted and
               write a script just to delete test users

    Personal Note: move the firstName and email to another place outside of the test
  */
  //200 - User Created
  it("Create user with success", () => {
    //Will be replace for an BeforeEach logic since it's used in every test
    cy.fixture("api-variables").as("apiData");
    cy.get("@apiData").then((apiData) => {
      appId = apiData.appId;
    });

    cy.request({
      method: "POST",
      url: "/user/create",
      headers: {
        "app-id": "6536af521956e10e49c899e2",
      },
      body: bodyParams,
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.eq({
        id: response.body.id,
        firstName: generatedFN,
        lastName: "Doe",
        email: generatedEmail.toLowerCase(), //The response body returns the email in all lowercase always
        registerDate: response.body.registerDate,
        updatedDate: response.body.updatedDate,
      });
    });
  });

  //400 - Email Already Used
  it("Create user with status 400", () => {
    cy.fixture("api-variables").as("apiData");

    cy.get("@apiData").then((apiData) => {
      appId = apiData.appId;
    });

    cy.request({
      method: "POST",
      url: "/user/create",
      failOnStatusCode: false,
      headers: {
        "app-id": "6536af521956e10e49c899e2",
      },
      body: {
        firstName: bodyParams.firstName,
        lastName: bodyParams.lastName,
        email: "evan.roux@example.com",
      },
    }).should((response) => {
      expect(response.status).to.eq(400);
    });
  });

  //403 - Invalid app-id
  it("Create user with status 403", () => {
    cy.fixture("api-variables").as("apiData");

    cy.get("@apiData").then((apiData) => {
      appId = apiData.appId;
    });

    cy.request({
      method: "POST",
      url: "/user/create",
      failOnStatusCode: false,
      headers: {
        "app-id": "wrongappid",
      },
      body: bodyParams,
    }).should((response) => {
      expect(response.status).to.eq(403);
    });
  });
});

describe("User Deletion Testing", () => {
  /*This create the test user that will be deleted
    The id variable is used to save the created user Id,
    the id is needed in order to delete the user
  */
  let id;
  beforeEach(() => {
    cy.fixture("api-variables").as("apiData");

    cy.request({
      method: "POST",
      url: "/user/create",
      headers: {
        "app-id": "6536af521956e10e49c899e2",
      },
      body: {
        firstName: faker.person.firstName(),
        lastName: "Doe",
        email: faker.internet.email(),
      },
    }).then((response) => {
      id = response.body.id;
    });
  });

  it("Delete user with success", () => {
    cy.request({
      method: "DELETE",
      url: `/user/${id}`,
      headers: {
        "app-id": "6536af521956e10e49c899e2",
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.eq({ id: id });
    });
  });

  //400 - Bad Request (Invalid parameters)
  it("Delete user with status 400", () => {
    cy.request({
      method: "DELETE",
      url: "/user/wrongid",
      failOnStatusCode: false,
      headers: {
        "app-id": "6536af521956e10e49c899e2",
      },
    }).should((response) => {
      expect(response.status).to.eq(400);
    });
  });
});

describe("Post Creation Testing", () => {
  let id;
  before(() => {
    cy.fixture("api-variables").as("apiData");

    cy.request({
      method: "POST",
      url: "/user/create",
      headers: {
        "app-id": "6536af521956e10e49c899e2",
      },
      body: {
        firstName: faker.person.firstName(),
        lastName: "Doe",
        email: faker.internet.email(),
      },
    }).then((response) => {
      id = response.body.id;
    });
  });

  it("Create post with success", () => {
    cy.request({
      method: "POST",
      url: "/post/create",
      headers: {
        "app-id": "6536af521956e10e49c899e2",
      },
      body: {
        text: "Lorem ipsum dolor sit amet, consectetuer",
        image:
          "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
        likes: 0,
        tags: ["animal", "dog", "golden retriever"],
        owner: id,
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
    });
  });

  //400 - Invalid Body (Owner Id is wrong on purpose)
  it("Create post with code 400", () => {
    cy.request({
      method: "POST",
      url: "/post/create",
      headers: {
        "app-id": "6536af521956e10e49c899e2",
      },
      failOnStatusCode: false,
      body: {
        text: "Lorem ipsum dolor sit amet, consectetuer",
        image:
          "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
        likes: 0,
        tags: ["animal", "dog", "golden retriever"],
        owner: "wrongownerid",
      },
    }).should((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.deep.eq({
        error: "BODY_NOT_VALID",
        data: {},
      });
    });
  });
});

describe("Post Deletion Testing", () => {
  /*This create the test post that will be deleted
    The id variable is used to save the post Id,
    the id is needed in order to delete the post
    */
 let id;
 beforeEach(() => {
    cy.request({
      method: "POST",
      url: "/post/create",
      headers: {
        "app-id": "6536af521956e10e49c899e2",
      },
      body: {
        text: "Lorem ipsum dolor sit amet, consectetuer",
        image:
          "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
        likes: 0,
        tags: ["animal", "dog", "golden retriever"],
        owner: "6538c4fbc278791dc83f1d6e",
      },
    }).then((response) => {
      id = response.body.id;
    });
  });

  it.only("Delete post with success", () => {
    cy.request({
      method: "DELETE",
      url: `/post/${id}`,
      headers: {
        "app-id": "6536af521956e10e49c899e2",
      }
    }).should((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
