#include<stdio.h>
#include<windows.h>
#include<conio.h>

int main(){
	system("dir /B > list.txt");
	printf("Press any key to continue:\n");
	while(_kbhit() == 0);
	
	FILE *fpin;
	if( (fpin = fopen("list.txt", "r")) == NULL){
		printf("fopen error!");
		return -1;
	}
	
	FILE *fpout;
	if( (fpout = fopen("index.html", "w")) == NULL ){
		printf("fopen error!");
		return -1;
	}
	
	#define MAX 255
	char list[MAX+1][128];
	int num = 0;
	
	for(int i=0; i<MAX; i++){
		char* ret = fgets(list[i], 128, fpin);
		if(ret == NULL) break;
		printf("[%2d] dir name:%s was read.\n", i, list[i]);
		num++;
		
	}
	
	fputs("<!doctype html>\n", fpout);
	fputs("<head>\n", fpout);
	fputs("<title>lankan</title>\n", fpout);
	fputs("</head>\n", fpout);
	fputs("<body>\n", fpout);
	for(int i=0; i<num; i++){
		fprintf(fpout, "<div class='myLinks'>\n\
			<a href='./%s'>%s</a>\n\
			</div>\n", list[i], list[i]
		);
	}
	fputs("</body>\n", fpout);



	return 0;
}