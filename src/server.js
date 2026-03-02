require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Identify endpoint: http://localhost:${PORT}/identify`);
});
