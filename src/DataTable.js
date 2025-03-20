import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const DataTable = ({ refresh }) => {
  const [data, setData] = useState([]); // Стан для збереження даних
  const [loading, setLoading] = useState(true); // Стан для індикації завантаження
  const [error, setError] = useState(null); // Стан для обробки помилок
  const [editData, setEditData] = useState(null); // Стан для збереження даних редагованого елементу
  const [isModalOpen, setIsModalOpen] = useState(false); // Стан для модального вікна

  useEffect(() => {
    fetchData('http://weatherspringbootapi-aganc0dbc2hub4cg.polandcentral-01.azurewebsites.net/api/observations/getAll');
    //fetchData('http://localhost:8080/api/observations/getAll');
  }, [refresh]);

  const fetchData = (url) => {
    setLoading(true);
    axios.get(url)
        .then(response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(err => {
            setError('Помилка завантаження даних');
            setLoading(false);
        });
};

  const handleEditRow = (observation) => {
    setEditData(observation);
    setIsModalOpen(true);
  };

  const handleDeleteRow = (id) => {
    axios.delete(`http://weatherspringbootapi-aganc0dbc2hub4cg.polandcentral-01.azurewebsites.net/api/observations/delete/${id}`)
      .then(() => {
        setData(data.filter(observation => observation.id !== id));
      })
      .catch(err => {
        setError('Помилка при видаленні');
      });
  };

  const handleSaveEdit = () => {
    const formattedDate = moment(editData.observationDate).format("YYYY-MM-DDTHH:mm:ss");
    axios.put(`http://weatherspringbootapi-aganc0dbc2hub4cg.polandcentral-01.azurewebsites.net/api/observations/edit/${editData.id}`, {
      ...editData,
      observationDate: formattedDate
    })
    .then(response => {
      setData(data.map(observation =>
        observation.id === editData.id ? response.data : observation
      ));
      setEditData(null);
      setIsModalOpen(false);
    })
    .catch(err => {
      console.error(err);
      setError('Помилка при оновленні даних');
    });
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Дані з таблиці</h1>
      <div style={{ marginBottom: '20px' }}>
                <button onClick={() => fetchData('http://weatherspringbootapi-aganc0dbc2hub4cg.polandcentral-01.azurewebsites.net/api/observations/getAll')}>
                    Всі дані
                </button>
                <button onClick={() => fetchData('http://weatherspringbootapi-aganc0dbc2hub4cg.polandcentral-01.azurewebsites.net/api/observations/getPositiveTemperature')}>
                    Температура більше 0
                </button>
                <button onClick={() => fetchData('http://weatherspringbootapi-aganc0dbc2hub4cg.polandcentral-01.azurewebsites.net/api/observations/getWithPrecipitation')}>
                    Присутні опади
                </button>
            </div>
      <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '70%', textAlign: 'center' }}>
        <thead >
          <tr>
            <th>ID</th>
            <th>Дата спостереження</th>
            <th>Температура</th>
            <th>Вологість</th>
            <th>Швидкість вітру</th>
            <th>Опади</th>
            <th>Управління</th>
          </tr>
        </thead>
        <tbody>
          {data.map((observation) => (
            <tr key={observation.id}>
              <td>{observation.id}</td>
              <td>{formatDateForDisplay(observation.observationDate)}</td>
              <td>{observation.temperature}</td>
              <td>{observation.humidity}</td>
              <td>{observation.windSpeed}</td>
              <td>{observation.precipitation}</td>
              <td>
                <button onClick={() => handleEditRow(observation)} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', marginRight:'7px' }}>
                    Редагувати
                </button>
                <button
                  onClick={() => handleDeleteRow(observation.id)}
                  style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none' }}
                > Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Редагувати спостереження</h2>
            <form>
              <label>
                Дата спостереження:
                <input
                  type="date"
                  value={editData.observationDate}
                  onChange={(e) => setEditData({ ...editData, observationDate: e.target.value })}
                />
              </label>
              <br />
              <label>
                Температура:
                <input
                  type="number"
                  value={editData.temperature}
                  onChange={(e) => setEditData({ ...editData, temperature: e.target.value })}
                />
              </label>
              <br />
              <label>
                Вологість:
                <input
                  type="number"
                  value={editData.humidity}
                  onChange={(e) => setEditData({ ...editData, humidity: e.target.value })}
                />
              </label>
              <br />
              <label>
                Швидкість вітру:
                <input
                  type="number"
                  value={editData.windSpeed}
                  onChange={(e) => setEditData({ ...editData, windSpeed: e.target.value })}
                />
              </label>
              <br />
              <label>
                Опади:
                <input
                  type="text"
                  value={editData.precipitation}
                  onChange={(e) => setEditData({ ...editData, precipitation: e.target.value })}
                />
              </label>
              <br />
              <button type="button" onClick={handleSaveEdit}>Зберегти</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>Скасувати</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  width: '400px',
  maxWidth: '90%',
};

export default DataTable;