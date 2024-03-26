import os

file_list=[]

folder_path= "D://CSI NMAMIT//csinmamit//public//eventsimg//2024"
for filename in os.listdir(folder_path):
    files_dict= {}
    file_path = os.path.join(folder_path, filename)
    if os.path.isfile(file_path):
        files_dict["event_name"] = filename
        files_dict["img"] = f"/eventsimg/2024/{filename}"
    file_list.append(files_dict)
    print(filename)
print(file_list)