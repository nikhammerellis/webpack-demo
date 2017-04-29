module.exports = () => {
  const element = document.createElement('div');
	
  element.className = 'pure-button';
  element.innerHTML = 'Hello World!'; 

  return element;
};