/*
JavaScript file - Notes Manager (VanillaJS)

Author : Rishav Das
*/

// Defining the required functions for the tool to work
const encrypt = (text, password) => {
	/* The function to encrypt a string using a password string ;-) */

	// Generating the unique key from the user specified password string
	let key = 0, n = 0;
	for (let i of password) {
		if (n % 2 == 0) {
			key += i.charCodeAt();
		} else {
			key -= i.charCodeAt();
		}
		n += 1;
	}
	if (key < 0) {
		key = key * (-1)
	}
	key += password.length;

	// Jumping the characters of the text (plain)
	let encryptedText = ``;
	text.split('').forEach((element, index) => {
		// Iterating through the each characters of the plain text specified by the user

		encryptedText += String.fromCharCode((element.charCodeAt() + key) % 256);
	});

	// Changing the encoding of the encrypted format of the text to base64 from utf-8
	encryptedText = btoa(encryptedText);
	return encryptedText;
}

const decrypt = (text, password) => {
	/* The function to decrypt a string using a password string that was used to encrypt it */

	// Generating the unique key from the user specified password string
	let key = 0, n = 0;
	for (let i of password) {
		if (n % 2 == 0) {
			key += i.charCodeAt();
		} else {
			key -= i.charCodeAt();
		}
		n += 1;
	}
	if (key < 0) {
		key = key * (-1)
	}
	key += password.length;

	// Changing the encoding of the encrypted format of the text to base64 from utf-8
	text = atob(text);

	// Jumping the characters of the text (encrypted) to plain text (original)
	let decryptedText = ``;
	text.split('').forEach((element, index) => {
	// Iterating through the each characters of the plain text specified by the user

	decryptedText += String.fromCharCode((element.charCodeAt() - key) % 256);
});

	return decryptedText;
}

const loadNotes = () => {
	/* The function to load the existing notes in the local storage of the web browser */

	// Getting the already existing data saved in local storage
	let notesData = localStorage.getItem('notes');
	if (notesData == null) {
		// If the notes items does not exists in the local storage of the web browser, then we declare a blank array for the variable 'notesData'

		notesData = [];
	} else {
		// If there are already existing data for the items 'notes' in the web browser's local storage, then we just parse the JSON object to an javascript array

		notesData = JSON.parse(notesData);
	}

	// Creating the notes HTML element from the fetched notes data from the local storage of the web browser
	const notesHtmlContainer = document.getElementById('notes-container');
	notesHtmlContainer.innerHTML = '';
	for (let note of notesData) {
		// Iterating through each notes of the noteData array

		notesHtmlContainer.innerHTML += `<div class="note-card"><small class="note-title">${note.title}</small><p class="note-content">${note.content}</p><input type="password" class="note-card-password" placeholder="Enter the password for decryption"><button class="btn decrypt-btn">Decrypt</button></div>`;
	}

	// Getting the decrypt notes button from each of the note cards
	let decryptNotesButtons = document.getElementsByClassName('decrypt-btn');

	// Adding the onclick event listener to each of the decrypt note buttons
	Array.from(decryptNotesButtons).forEach((element, index) => {
		element.addEventListener('click', (e) => {
			// When the user clicks on the decrypt button for any note card, then this function gets called automatically

			e.preventDefault();

			// Decrypting the note card as per prefered by the user
			let password = Array.from(document.getElementsByClassName('note-card-password'))[index];  // Getting the password as per entered by the user
			let text = Array.from(document.getElementsByClassName('note-content'))[index];  // Getting the  HTML element that shows content (encrypted text) of the note ( We will use it for later updation)
			try {
				let decryptedText = decrypt(notesData[index].content, password.value);  // Calling the decrypt function with the requested parameters

				// After decryption, setting the note card's content to the decrypted form
				text.innerText = decryptedText;
			} catch(error) {
				alert(`${error}`);
			}
		});
	});
}

// Getting the add note button HTML element
const addNoteBtn = document.getElementById('add-note-btn');
addNoteBtn.addEventListener('click', (e) => {
	// The function to be executed when the user clicks on the addNoteBtn. We will add the note to the local storage after the encryption and then we will update the entire notes container HTML element

	// Reading the note content and password
	let title = document.querySelector('input[name="note-title"]').value;
	let text = document.querySelector('textarea[name="note-content"]').value;
	let password = document.querySelector('input[name="note-password').value;

	// Encrypting the note content
	try {
		text = encrypt(text, password);

		// If there are no errors in the process, then we continue to insert our note data to the local storage of our web browser
		let note = {title : title, content : text}
		notesData = localStorage.getItem('notes');
		if (notesData == null) {
			notesData = [];
		} else {
			notesData = JSON.parse(notesData);
		}
		notesData.push(note);
		localStorage.setItem('notes', JSON.stringify(notesData)); // Inserting the data into the local storage after upgrading it.
		loadNotes();  // Loading the notes once again for updating
	} catch(error) {
		// If there are any errors in the process then we raise an error using the alert box

		alert(`${error}`);
	}
});

// When the window loads, we are also updating the notes-container
loadNotes();