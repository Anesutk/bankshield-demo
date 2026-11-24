import './globals.css';

export const metadata = {
  title: 'BankShield AI · Interactive Banking Intelligence Demo',
  description: 'An interactive, synthetic-data demonstration of personalised banking behaviour, churn intelligence, customer value and multi-agent decision support.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
