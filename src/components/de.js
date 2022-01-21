import de from '../assets/de.png';

export default () => {
  return (
    <div
      style={{
        backgroundColor: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img style={{ maxHeight: 'calc(100vh - 50px - 70px)' }} src={de} alt="小德红包封面" />
    </div>
  );
};
