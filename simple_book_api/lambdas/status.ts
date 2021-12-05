export async function handler() {
  try {
    return {
      statusCode: 200,
      body: `{ "status": "OK" }`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
}
