import { FormEventHandler } from "react";

interface InfoFormProps {
  onSubmit: FormEventHandler;
  name: string;
  placeholder?: string;
}

const InfoForm = ({ onSubmit, name, placeholder }: InfoFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <input autoComplete="off" name={name} placeholder={placeholder} />
      <button type="submit">Send</button>
    </form>
  );
};

export default InfoForm;
