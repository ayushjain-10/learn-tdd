import app from "../server";
import request from "supertest";
import Author from "../models/author";

describe("Verify GET /authors", () => {
    let consoleSpy: jest.SpyInstance;

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    it("should respond with a list of author names and lifetimes sorted by family name", async () => {
        const mockAuthors = [
            "Doe, John : 1990 - 2020",
            "Smith, Jane : 1992 - ",
            "Woon, Kim : 1958 - 2020"
        ];

        Author.getAllAuthors = jest.fn().mockResolvedValue(mockAuthors);

        const response = await request(app).get("/authors");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(mockAuthors);
    });

    it("should respond with 'No authors found' message when there are no authors", async () => {
        Author.getAllAuthors = jest.fn().mockResolvedValue([]);

        const response = await request(app).get("/authors");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("No authors found");
    });

    it("should respond with 500 if there is an error retrieving authors", async () => {
        Author.getAllAuthors = jest.fn().mockRejectedValue(new Error("Database error"));

        const response = await request(app).get("/authors");
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("No authors found");
        expect(consoleSpy).toHaveBeenCalled();
    });
}); 