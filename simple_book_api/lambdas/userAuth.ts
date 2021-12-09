export async function handler() {
  try {
    return {
      statusCode: 200,
      body: `{ "status": "OK from use Auth" }`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
}
