package mancalaPackage;

import java.util.ArrayList;

public class MancalaSolver {
	
	public static Bin[] bins = new Bin[13];
	public static Bin startingBin=new Bin();
	public static ArrayList<Sequence> sequences = new ArrayList<Sequence>();
	public static Sequence currSequence=new Sequence();
	public static Boolean nextBinExists=false;
	
	public static void main(String[] args) {		  
		sequences.add(currSequence);
		currSequence.layouts.add("4 4 4 4 4 4 0 4 4 4 4 4 4");
		layoutStones(currSequence.layouts.get(0));
		findStartingBin(0);
		moveStones();
	}
		  
	public static void layoutStones(String layout){
		String[] stoneAmount=layout.split(" ");	
		for(int i=0;i<=12;i++){
				bins[i].stones=Integer.valueOf(stoneAmount[i]);				
		}
	}
		  
	public static void findStartingBin(int start){
		for(int i=start;i<6;i++){
			if (!bins[i].isEmpty()){
				startingBin=bins[i];
				currSequence.turns.add(i); 
			nextBinExists= true;
			}
		}
		nextBinExists=false;
	}
		  
	public static void moveStones(){
		int currIndex=startingBin.index;
		int hand=startingBin.stones;
		startingBin.stones=0;
		while(hand>0){
			currIndex++;
			if (currIndex==13)currIndex=0;
			bins[currIndex].stones++;
			hand--;
		}
		startingBin=bins[currIndex];
		
		if (currIndex==6){
			storeLayout(currSequence);
			findStartingBin(0);
		}else if(startingBin.stones==1){
			closeSequenceAndOpenNext();
		}else{
			moveStones();
		}
	}
	
	public static void storeLayout(Sequence sequence){
		String layout="";
		for(Bin bin:bins){
			layout+=(Integer.valueOf(bin.stones)+" ");
		}
		sequence.layouts.add(layout.trim());
		System.out.println(layout.trim());
	}
	
	public static void closeSequenceAndOpenNext(){
			bins[6].stones=bins[12-startingBin.index].stones + 1;
			currSequence.potTotal=bins[6].stones;
			
			Sequence nextSequence=new Sequence();
			nextSequence.layouts=currSequence.layouts;
			nextSequence.turns=currSequence.turns;
			currSequence=nextSequence;
			sequences.add(currSequence);
			
	}
		  
	public static void retractMoves(){
			layoutStones(currSequence.layouts.get(currSequence.layouts.size()-1));
			findStartingBin(currSequence.turns.get(currSequence.turns.size()-1) + 1);
			currSequence.turns.remove(currSequence.turns.size()-1);
			if (nextBinExists){
				currSequence.turns.add(startingBin.index);
				moveStones();
		    }else {
		    	currSequence.layouts.remove(currSequence.layouts.size()-1);
		    	retractMoves();
		    }
	}
}
