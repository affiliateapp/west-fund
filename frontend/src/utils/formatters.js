export const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

export const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { 
  month: 'short', 
  day: 'numeric', 
  year: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit' 
});
