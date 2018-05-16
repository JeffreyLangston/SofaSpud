Synchronizes equity quotes with the Database.

To Run:
npm install
npm start


TODO:
1.Store a list of funds to sync
2.Look at the last sync time
	If last sync time is more than an hour old and markets were open after this submission.
		Go through all funds that haven't been synced and update their values.
		Get each funds latest quote and update the database.
3.
