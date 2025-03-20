import React, { useState } from 'react';
import DataTable from './DataTable';
import moment from 'moment';
import axios from 'axios';

const App = () => {
  const [addData, setAddData] = useState({});
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleSaveAdd = () => {
      const formattedDate = moment(addData.observationDate).format("YYYY-MM-DDTHH:mm:ss");

      axios.post(`http://weatherspringbootapi-aganc0dbc2hub4cg.polandcentral-01.azurewebsites.net/api/observations/create`, {
          ...addData,
          observationDate: formattedDate
      })
      .then(() => {
          setAddData({});
          setRefresh(!refresh);
      })
      .catch(err => {
          console.error(err);
          setError('Помилка при оновленні даних');
      });
  };

  if (error) return <p>{error}</p>;

  return (
      <div style={{ padding: '20px' }}>
          <h1>Спостереження за погодою</h1>

          <div style={{ marginTop: '20px' }}>
              <h2>Додати спостереження</h2>
              <form>
                  <label>
                      Дата спостереження:
                      <input
                          type="date"
                          value={addData.observationDate || ""}
                          onChange={(e) => setAddData({ ...addData, observationDate: e.target.value })}
                      />
                  </label>
                  <br/>
                  <label>
                      Температура:
                      <input
                          type="number"
                          value={addData.temperature || ""}
                          onChange={(e) => setAddData({ ...addData, temperature: e.target.value })}
                      />
                  </label>
                  <br />
                  <label>
                      Вологість:
                      <input
                          type="number"
                          value={addData.humidity || ""}
                          onChange={(e) => setAddData({ ...addData, humidity: e.target.value })}
                      />
                  </label>
                  <br />
                  <label>
                      Швидкість вітру:
                      <input
                          type="number"
                          value={addData.windSpeed || ""}
                          onChange={(e) => setAddData({ ...addData, windSpeed: e.target.value })}
                      />
                  </label>
                  <br />
                  <label>
                      Опади:
                      <input
                          type="text"
                          value={addData.precipitation || ""}
                          onChange={(e) => setAddData({ ...addData, precipitation: e.target.value })}
                      />
                  </label>
                  <br />
                  <button type="button" onClick={handleSaveAdd}>Зберегти</button>
                  <button type="button" onClick={() => setAddData({})}>Скасувати</button>
              </form>
          </div>

          <DataTable refresh={refresh} />
      </div>
  );
};
export default App;