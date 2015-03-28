import socket

def Main():
	host = '127.0.0.1'
	port = 5000
	
	s = socket.socket()
	s.connect((host,port))
	
	filename = input("Filename? -> ")
	if filename != "q":
		s.send(filename.encode('utf-8'))
		data = s.recv(1024)
		data = data.decode('utf-8')
		if data[:6] == "EXISTS":
			filesize = int(data[6:])
			message = input("File Exists. " + str(filesize) + \
			" bytes, download? (Y/N) -> ")
			if message == 'Y':
				s.send('OK'.encode('utf-8'))
				data = s.recv(1024)
				totalRecv = len(data)
				f = open("new_" + filename, 'wb')
				f.write(data)
				while totalRecv < filesize:
					data = s.recv(1024)
					totalRecv += len(data)
					f.write(data)
				print ("Download complete")
				f.close()
		else:
			print ("file doesn't exist")
	s.close()

try:
	if __name__ == '__main__':
		Main()
except Exception as e:
	print (e)

input()