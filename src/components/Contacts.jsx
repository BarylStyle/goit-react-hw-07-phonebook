import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { fetchContacts, addContact, removeContact, setFilter } from '../features/contactsSlice';
import styles from './Contacts/Contact.module.scss';

const Contacts = () => {
  const contacts = useSelector(state => state.contacts.contacts) || [];
  const filter = useSelector(state => state.contacts.filter) || '';
  const status = useSelector(state => state.contacts.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchContacts());
    }
  }, [status, dispatch]);

  const handleChange = ev => {
    const { name, value } = ev.target;
    if (name === 'filter') {
      dispatch(setFilter(value));
    }
  };

  const handleSubmit = ev => {
    ev.preventDefault();
    const form = ev.target;
    const name = form.name.value;
    const number = form.number.value;

    const isDuplicate = contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase());

    if (isDuplicate) {
      alert(`Kontakt o nazwie "${name}" już istnieje.`);
      return;
    }

    const isValidNumber = /^[0-9]+$/.test(number);

    if (!isValidNumber) {
      alert('Numer telefonu musi zawierać tylko cyfry.');
      return;
    }

    dispatch(addContact({ name, number }));
    form.reset();
  };

  const handleDelete = id => {
    dispatch(removeContact(id));
  };

  const nameId = nanoid();
  const numId = nanoid();
  const searchId = nanoid();

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor={nameId}>Imię</label>
        <input
          id={nameId}
          type="text"
          name="name"
          required
        />
        <label htmlFor={numId}>Numer telefonu</label>
        <input
          id={numId}
          type="tel"
          name="number"
          required
          pattern="[0-9]*"
          title="Numer telefonu musi zawierać tylko cyfry."
        />
        <button type="submit">Dodaj kontakt</button>
      </form>
      <h1>Kontakty</h1>
      <form className={styles.searchForm}>
        <label htmlFor={searchId}>Szukaj kontaktu</label>
        <input
          type="text"
          id={searchId}
          name="filter"
          value={filter}
          onChange={handleChange}
        />
      </form>
      <ul className={styles.list}>
        {contacts
          .filter(el => el.name.toLowerCase().includes(filter.toLowerCase()))
          .map(contact => (
            <li key={contact.id}>
              {contact.name} - {contact.number}
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleDelete(contact.id)}
              >
                Usuń
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

Contacts.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
  })),
  filter: PropTypes.string,
};

export default Contacts;
