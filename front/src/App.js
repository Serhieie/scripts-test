import { Button } from 'antd';
import axios from 'axios';
const url = 'http://localhost:3000/api/catch-me-work';

function App() {
  const start = async () => {
    await axios
      .post(url)
      .then(response => {
        console.log('Отримана відповідь від сервера:', response.data);
      })
      .catch(error => {
        console.error('Сталася помилка при виконанні запиту:', error);
      });
  };

  return (
    <div className="w-[200px] mx-auto flex items-center justify-center mt-96">
      <Button
        className="font-semibold text-2xl px-12 py-6 flex items-center"
        onClick={start}
        type="primary"
      >
        Просто Натисни
      </Button>
    </div>
  );
}

export default App;
