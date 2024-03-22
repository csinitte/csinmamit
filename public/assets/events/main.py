
# import OS module
import os
# Get the list of all files and directories
path = "D://CSI NMAMIT//csinmamit//public//eve"
dir_list = os.listdir(path)
print("Files and directories in '", path, "' :")
# prints all files
print(dir_list)
li = []
for i in dir_list:
    a = f"/highlights/{i}"
    li.append(a)
print(li)