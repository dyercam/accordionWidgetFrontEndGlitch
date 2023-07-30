import { useState, useEffect } from 'react';
import '../styles/App.css';

function GetData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [tagsArray, setTagsArray] = useState([]);
  const [filterList, setFilterList] = useState(() => {
    const storedFilterList = localStorage.getItem('filterList');
    return storedFilterList ? JSON.parse(storedFilterList) : [];
  });

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

    const updatedTagsArray = [];
    data.forEach(item => {
      const tags = item.Tags.multi_select;
      tags.forEach(tag => {
        if (!updatedTagsArray.includes(tag.name)) {
          updatedTagsArray.push(tag.name);
        }
      });
    });
    setTagsArray(updatedTagsArray);
  }, [data]);

  useEffect(() => {
    localStorage.setItem('filterList', JSON.stringify(filterList));
  }, [filterList]);

  const handleButtonClick = name => {
    if (filterList.includes(name)) {
      setFilterList(prevList => prevList.filter(item => item !== name));
    } else {
      setFilterList(prevList => [...prevList, name]);
    }
  };

  function IndividualButton({ name }) {
    const checkFilter = filterList.includes(name);

    const buttonClick = () => {
      handleButtonClick(name);
    };

    return (
      <button
        key={name}
        className={checkFilter ? 'clicked' : 'unclicked'}
        onClick={buttonClick}
      >
        {name}
      </button>
    );
  }

  function TagButtons() {
    return (
      <>
        <div className='header'>
          Tags:
          {tagsArray.map(item => (
            <IndividualButton key={item} name={item} />
          ))}
        </div>
        <span className='header'>&nbsp;</span>
        <FullAccordion data={info} filterList={filterList} />
      </>
    );
  }

  return <TagButtons />;
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
  const filteredData = filterList.length > 0 ? data.filter(item => item.tags.some(tag => filterList.includes(tag))) : data;

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
