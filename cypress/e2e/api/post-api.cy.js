import { faker } from "@faker-js/faker";

describe("Post Creation Testing", () => {
  let userid;
  let postid;

  //Create user
  before(() => {
    cy.fixture("api-variables").as("apiData");

    cy.request({
      method: "POST",
      url: "/user/create",
      headers: {
        "app-id": Cypress.env("appId"),
      },
      body: {
        firstName: faker.person.firstName(),
        lastName: "Doe",
        email: faker.internet.email(),
      },
    }).then((response) => {
      userid = response.body.id;
    });
  });

  //Delete user after the test is complete
  after(() => {
    cy.request({
      method: "DELETE",
      url: `/post/${postid}`,
      headers: {
        "app-id": Cypress.env("appId"),
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Create post with success", () => {
    cy.request({
      method: "POST",
      url: "/post/create",
      headers: {
        "app-id": Cypress.env("appId"),
      },
      body: {
        text: "Lorem ipsum dolor sit amet, consectetuer",
        image:
          "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
        likes: 0,
        tags: ["animal", "dog", "golden retriever"],
        owner: userid,
      },
    }).should((response) => {
      postid = response.body.id;
      expect(response.status).to.eq(200);
    });
  });
});
context("Fail Cases", () => {
  //400 - Invalid Body (Owner Id is wrong on purpose)
  it("Create post with code 400", () => {
    cy.request({
      method: "POST",
      url: "/post/create",
      headers: {
        "app-id": Cypress.env("appId"),
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
  let postid;
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "/post/create",
      headers: {
        "app-id": Cypress.env("appId"),
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
      postid = response.body.id;
    });
  });

  it("Delete post with success", () => {
    cy.request({
      method: "DELETE",
      url: `/post/${postid}`,
      headers: {
        "app-id": Cypress.env("appId"),
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
