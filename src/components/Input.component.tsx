interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const InputComponent = ({ label, value, onChange, name }: InputProps) => {
  return (
    <div>
      <label className="block text-left">{label}</label>
      <input
        className="h-9 my-2"
        type="text"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputComponent;
