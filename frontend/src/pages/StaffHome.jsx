import { useAuth } from '../context/AuthContext';

const StaffHome = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <div className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4">Store Staff Dashboard</h1>
        <p>Welcome, {user.name}.</p>
      </div>
    </div>
  );
};

export default StaffHome;