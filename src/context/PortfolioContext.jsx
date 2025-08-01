import { createContext, useContext } from 'react';
import usePortfolioData from '../hooks/usePortfolioData';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const portfolioData = usePortfolioData();

  return (
    <PortfolioContext.Provider value={portfolioData}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export default PortfolioContext; 