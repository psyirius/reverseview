# remoteverseview
Repository for implementing Remote VerseVIEW which is embedded with the VerseVIEW Windows/MAC application

VerseVIEW PC application has a built in web server engine. The Remote VerseVIEW is a web interface that communicates to the web server on VerseVIEW PC application.


The Remote VerseVIEW files are located in the following folder on Windows [C:\Users\[UserName]\AppData\Roaming\verseview7\Local Store\network\webroot\] and on MAC []

Update the files from and copy to the webroot folder in VerseVIEW to use it.


## Files
- index.html - Initial launch file for controlling presentation
- fonts.css - CSS file with Font mappings
- vv.css - CSS file for the remote VerseVIEW design
- bible_present.js - JS file that handles remote VerseVIEW page
- ./jslib/ - Includes UI and JavaScript library such as OnSenUI, Jquery (Future implementation with Bootstrap)
- ./images/ - Icons used in the remote application
- ./font/ - Fonts used for VerseVIEW, including custom fonts
- ./chat/ - VerseVIEW Messenger test implementation
- ./lowerthird/ - Folder for the design of lower third feature


## Pages / Sections
1. Bible
2. Scheduled Songs
3. Scheduled Verses
4. Song Lyrics
5. VerseVIEW Messenger (Chat feature)
6. StageVIEW
7. Lower Third View (For Live Stream)

## Commands
- Command 1
  - Function: Present Bible Verse
  - Value: Reference (psa 23 1, or psa 23:1)
  - Output: String "Presenting verse..." if reference is valid else error message

- Command 2
  - Function: Next Slide (Verse and song)
  - Value: NONE
  - Output: String "Next slide OK...."

- Command 3
  - Function: Previous Slide (Verse and song)
  - Value: NONE
  - Output: String "Previous slide OK...."

- Command 9
  - Function: Display the design of Lower third window
  - Value: NONE
  - Output: String with title | font 1 | font 2 | text 1 | text 2

* OTHER COMMANDS WILL BE DOCUMENTED SOON

## Libraries
Initial implementation uses Jquery and Jquery Mobile. Future implemenation with a modern UI framework like bootstrap

## Contact
Please email verseview@gmail.com for any questions, comments or suggestions. Thank you very much for your support in making VerseVIEW better.

## Revision
Updated on Oct 24, 2020