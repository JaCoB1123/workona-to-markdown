# Convert Workona-JSON to Markdown
I wrote this little script to be able to convert my Workona Tabs to Markdown. 

To use, just put your Workona-Export in a file `userData.json` in the same folder
as the index.js and run

```
node index.js
```

The program will output a `result.md` and create a file `leftover.json` containing
anything from user input file, that was not handled. If there's anything important,
in it, you might have to extend the script a bit.
