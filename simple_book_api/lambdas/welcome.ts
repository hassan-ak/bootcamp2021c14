export async function handler() {
  try {
    return {
      statusCode: 200,
      body: `{ "message": "Welcome to Simple Book API" }`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
}
