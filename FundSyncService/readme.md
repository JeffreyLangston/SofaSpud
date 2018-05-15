Synchronizes equity quotes with the Database.

TODO:
1.Store a list of funds to sync
2.Look at the last sync time
	2a. If last sync time is more than an hour old and markets were open after this submission ago try to get data.
	2b. Go through all funds that haven't been synced and update their values.
