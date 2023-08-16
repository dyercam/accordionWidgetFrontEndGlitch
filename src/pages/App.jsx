import { useState, useEffect } from 'react';
import '../styles/App.css';

function GetData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [filterList, setFilterList] = useState([]);
  
  // manualFilterList is a List of filter values
  //Fill it with the filter names you want to show up! 
  //ex: 'Material','Testing','Entity'
  //If the list is empty (i.e. len==0 ), the widget will return the full FAQ
  
  //INPUT HERE!!!!!
  const manualFilterList = [];
  //INPUT HERE!!!!!

  useEffect(() => {
    fetch('https://educated-married-visor.glitch.me')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error retrieving data:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const updatedInfo = data.map(item => ({
      question: item.Question.title.map(subItem => subItem.text.content).join(''),
      answer: item.Answer.rich_text.map(subItem => subItem.text.content).join(''),
      tags: item.Tags.multi_select.map(subItem => subItem.name)
    }));
    setInfo(updatedInfo);

    // Set the filterList to the manualFilterList array
    setFilterList(manualFilterList);
  }, [data]);

  

  return (
    <>
      <FullAccordion data={info} filterList={filterList} />
    </>
  );
}

function AccordionSection({ question, answer }) {
  const [clicked, setClicked] = useState('panel');
  const [symbol, setSymbol] = useState('+');

  const functionality = () => {
    if (clicked === 'panel') {
      setClicked('panelShown');
      setSymbol('-');
    } else {
      setClicked('panel');
      setSymbol('+');
    }
  };

  return (
    <>
      <div className='accordion' onClick={functionality}>
        {question} <span className='signal'>{symbol}</span>{' '}
      </div>

      <div className={clicked}>
        <p>{answer}</p>
      </div>
    </>
  );
}

function FullAccordion({ data, filterList }) {
  // Check if the filterList is empty
  if (filterList.length === 0) {
    return (
      <>
        <div>
          {data.map((info, index) => (
            <AccordionSection key={index} question={info.question} answer={info.answer} />
          ))}
        </div>
      </>
    );
  }

  // If filterList is not empty, apply filtering logic
  const filteredData = data.filter(item => item.tags.some(tag => filterList.includes(tag)));

  return (
    <>
      <div>
        {filteredData.map((info, index) => (
          <AccordionSection key={index} question={info.question} answer={info.answer} />
        ))}
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <div></div>
      <GetData />
    </>
  );
}

export default App;
