import { NextPage } from "next";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { executeRequest } from "../services/api";
import Swal from "sweetalert2";
type ModalProps = {
  showModal: boolean;
  setShowModal(show: boolean): void;
};

export const CreateUserModal: NextPage<ModalProps> = ({ showModal, setShowModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSave = async () => {
    if (name && email && password && passwordConfirmation && isValidEmail && isValidPassword) {
      const body = {
        name,
        email,
        password,
      };

      const result = await executeRequest("user", "POST", body);
      if (result && result.status === 200) {
        const toast = Swal.mixin({
          toast: true,
          position: "top",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        toast.fire({
          title: "Usuário criado com sucesso",
          icon: "success",
        });

        closeModal();
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setName("");
    setEmail("");
    setPasswordConfirmation("");
    setPassword("");
  };

  const validateEmail = () => {
    const matchEmailCount = email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )?.length;
    const emailValidation = !!matchEmailCount;
    setIsValidEmail(emailValidation);
  };

  const validatePassword = () => {
    setIsValidPassword(password === passwordConfirmation);
  };

  return (
    <Modal show={showModal} onHide={() => closeModal()} className="container-modal">
      <Modal.Body>
        <p>Criar novo usuário</p>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={true}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
          onBlur={validateEmail}
        />
        {!isValidEmail && <p className="errorMsg">email inválido</p>}
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
          onBlur={() => !!passwordConfirmation && validatePassword()}
        />
        <input
          type="password"
          placeholder="Confirme sua senha"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required={true}
          onBlur={validatePassword}
        />
        {!isValidPassword && <p className="errorMsg">senha não confere</p>}
      </Modal.Body>
      <Modal.Footer>
        <div className="button col-12">
          <button onClick={handleSave}>Criar</button>
          <span onClick={closeModal}>Cancelar</span>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
