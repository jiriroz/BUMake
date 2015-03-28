import socket
import threading
import time

def Main():
	
	tLock = threading.Lock()
	shutdown = False

	def receiving(name,sock):
		while not shutdown:
			try:
				tLock.acquire()
				while True:
					data, addr = sock.recvfrom(1024)
					print (str(data))
			except:
				pass
			finally:
				tLock.release()

	host = '127.0.0.1'
	port = 0

	server = ('127.0.0.1', 5000)

	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.bind((host,port))
	s.setblocking(0)

	rT = threading.Thread(target = receiving, args = ('RecvThread',s))
	rT.start()

	alias = input('Name: ')
	message = input(alias + ' -> ')
	while message != 'Quit':
		if message != '':
			s.sendto((alias + ': ' + message).encode('utf-8'), server)
		tLock.acquire()
		message = input(alias + ' -> ')
		tLock.release()
		time.sleep(0.2)

	shutdown = True
	rT.join()
	s.close()

try:
	if __name__ == '__main__':
		Main()
except Exception as e:
	print (e)


input()