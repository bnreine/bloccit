const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;


describe("routes: flairs", () => {

  beforeEach((done) => {
    this.topic;
    this.flair;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "The winter games",
        description: "Are fun"
      }).then((topic) => {
        this.topic = topic;
        Flair.create({
          name: "flair one",
          color: "purple",
          topicId: this.topic.id
        }).then((flair) => {
          this.flair = flair;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });



  describe("GET /topics/:id/flairs/new", () => {

    it("should render a new flair form", (done) => {
      request.get(`${base}/${this.topic.id}/flairs/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Flair");
        done();
      });
    });

  });

  describe("POST /topics/:id/flairs/create", () => {

    it("should create and store a new flair", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/flairs/create`,
        form: {
          name: "Miranda",
          color: "blue"
        }
      };
      request.post(options, (err, res, body) => {
        Flair.findOne({
          where: {name: "Miranda"}
        })
        .then((flair) => {
          expect(flair).not.toBeNull();
          expect(flair.name).toBe("Miranda");
          expect(flair.color).toBe("blue");
          expect(flair.topicId).not.toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

  });


  describe("GET /topics/:id/flairs/:id", () => {

    it("should render a view with the selected flair", (done) => {
      request.get(`${base}/${this.topic.id}/flairs/${this.flair.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("flair one");
        done();
      });
    });

  });





  describe("POST /topics/:topicId/flairs/:id/destroy", () => {

    it("should delete the flair with the associated ID", (done) => {
      expect(this.flair.id).toBe(1);
      let url = `${base}/${this.topic.id}/flairs/${this.flair.id}/destroy`;
      request.post(url, (err, res, body) => {
        Flair.findById(1)
        .then((flair) => {
          expect(err).toBeNull();
          expect(flair).toBeNull();
          done();
        });
      });
    });

  });



  describe("GET /topics/:topicId/flairs/:id/edit", () => {

    it("should render an edit form for the aassociated flair", (done) => {
      let url = `${base}/${this.topic.id}/flairs/${this.flair.id}/edit`;
      request.get(url, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Flair");
        expect(body).toContain("flair one");
        done();
      });
    });

  });


  describe("POST /topics/:topicId/flairs/:id/update", () => {

    it("should update the selected flair", (done) => {
      let options = {
        url: `${base}/${this.topic.id}/flairs/${this.flair.id}/update`,
        form: {
          name: "Sophie",
          color: "red"
        }
      };
      Flair.findOne({
        where: {name: "flair one"}
      })
      .then((flair) => {
        expect(flair.name).toBe("flair one");
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Flair.findOne({
            where: {id: this.flair.id}
          })
          .then((flair) => {
            //expect(err).toBeNull();
            expect(flair.name).toBe("Sophie");
            expect(flair.color).toBe("red");
            done();
          });
        });
      });
    });

  });




});
