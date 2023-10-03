import React, { useState, useEffect } from 'react';
import './App.css';
import Preview from './components/Preview';
import Message from './components/Message';
import NotesContainer from './components/Notes/Notescontainer';
import NotesList from './components/Notes/NotesList';
import Note from './components/Notes//Note';
import NoteForm from './components/Notes/NoteForm';
import Alert from './components/Alert';

function App() {

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false); 
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if(localStorage.getItem('notes')){
      setNotes(JSON.parse(localStorage.getItem('notes')))
    }else{
      localStorage.setItem('notes',JSON.stringify([]))
    }
  }, []);

  useEffect(() => {
    if(validationErrors.length !== 0) {
      setTimeout(() => {
        setValidationErrors([])
      }, 3000);
    }
  }, [validationErrors]);

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const validate = () => {
    const validationErrors = [];
    let passed = true;
    if(!title){
      validationErrors.push("Please enter a title.");
      passed= false;
      }
      if (!content) {
        validationErrors.push("Please add some text to your note");
        passed= false;
      }

      setValidationErrors(validationErrors);
      return passed;
  }

  // تغيير عنوان الملاحظة
  const changeTitleHandler = (e) => {
    setTitle(e.target.value);
  }

  // تغيير محتوى الملاحظة
  const changeContentHandler = (e) =>{
    setContent(e.target.value);
    
  }

  //حفظ الملاحظة
  const saveNoteHandler = () => {

    if (!validate()) return;

    const note = {
      id: new Date(),
      title : title ,
      content: content,
    }

    const updatedNote = [...notes, note];
    saveToLocalStorage('notes', updatedNote);
    setNotes(updatedNote);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle('');
    setContent('');
  }

  // اختيار ملاحظة
  const selectedNoteHandler = noteId => {
    setSelectedNote(noteId);
    setEditing(false);
    setCreating(false);
  }

  // الانتقال الى وضع تعديل الملاحظة
  const editNoteHandler = () => {
    const note = notes.find(note => note.id === selectedNote);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  }

  // تعديل الملاحظة
  const updateNoteHandler = () => {
    if (!validate()) return;
    const updatedNotes= [...notes];
    const noteIndex = notes.findIndex(note => note.id === selectedNote);
    updatedNotes[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content
    }

    saveToLocalStorage('notes', updatedNotes);
    setNotes(updatedNotes);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  // حذف ملاحظة
  const removeNoteHandler = () => {
    // const updatedNote = [...notes];
    // const noteIndex = updatedNote.findIndex((note) => note.id === selectedNote);
    // notes.splice(noteIndex, 1);
    // setNotes(notes);

    const filteredNotes =  notes.filter((note) => (note.id !==selectedNote));
    saveToLocalStorage('notes', filteredNotes);
    setNotes(filteredNotes);
    setEditing(false);
    setTitle('');
    setContent('');
    setSelectedNote(null);
  }

  // الانتقال الى واجهة اضافة ملاحظة
  const addNoteHandler = () => {
    setCreating(true);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  const getAddNote = () => {
    return (
      <NoteForm 
        formTitle='ملاحظة جديدة'
        title= {title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChangend={changeContentHandler}
        submitText='حفظ'
        submitClicked={saveNoteHandler}
      />
    );
  };
  
  
  const getPreview = () => {
    if (notes.length < 1 ) {
      return <Message title='لايوجد ملاحظة'/>
    }

    if (!selectedNote) {
      return <Message title='الرجاء اختيار ملاحظة' />
    }

    const note = notes.find( note => {
      return note.id === selectedNote;
    });

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    )

    if (editing) {
      noteDisplay = (
        <NoteForm 
          formTitle='تعديل جديدة'
          title= {title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChangend={changeContentHandler}
          submitText='تعديل'
          submitClicked={updateNoteHandler}
        />
      )
    }

    return (
      <div>
        {!editing && 
          <div className="note-operations">
            <a href="#" onClick={editNoteHandler}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#">
              <i className="fa fa-trash" onClick={removeNoteHandler}/>
            </a>
          </div>
        }
        {noteDisplay}
      </div>
    );
  };



  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
          {notes.map(note => 
          <Note key={note.id} 
          title={note.title} 
          noteClicked={() => selectedNoteHandler(note.id)}
          active={selectedNote === note.id} />
          )}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NotesContainer>
      <Preview>
        {creating ? getAddNote() : getPreview()}
      </Preview>
      {validationErrors.length !== 0 && <Alert validationMessages= {validationErrors}/>}
    </div>
  );
}

export default App;
