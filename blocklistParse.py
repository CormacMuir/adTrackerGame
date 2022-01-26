from os import write


trackers=[]
tracker_urls=[]
with open("trackerlist.txt",'r') as f:
    lines = f.readlines()
    
    
    
    for line in lines:
        line = line.rstrip("\n")[2:-1]

        trackers.append("'"+line+"'")
        tracker_urls.append('*://*.'+line+'/*')

with open("trackerlist.js",'w') as f:
    f.write("var tracker_domains = {\n")
    for i in range(len(trackers)):
        f.write(trackers[i]+":['"+tracker_urls[i]+"'],\n")
    
    f.write("}\nexport function tracker_domains() {\n\treturn tracker_domains;\n}")
    
    