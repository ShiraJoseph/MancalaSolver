package mancalaPackage;

import java.util.ArrayList;

public class MancalaSolver{
	public static Bin[] bins = new Bin[13];
	public static Bin startBin = new Bin();
	public static ArrayList<Sequence> sequences = new ArrayList<Sequence>();
	
	public static void main(String[] args){
		boolean gameNotOver=true;
		while(gameNotOver){
			runSequence();
		}
	}
	
	public static void runSequence(){
		findNextSequence();
		resetBoard();
		Sequence currSequence = new Sequence("");
		sequences.add(currSequence);
		boolean sequenceNotOver=true;
		while(sequenceNotOver){
			currSequence.turnsRecord=currSequence.turnsRecord.concat(Integer.toString(startBin.index));
			runMove();
			if(startBin.stoneCount==6){
				//continue here
			}
		}
	}
	
	private static void findNextSequence() {
		
		//continue from here
		
		
	}

	public static void runMove(){
		boolean moveNotOver=true;
		while(moveNotOver){
			distributeStones();
			if (startBin.stoneCount==1||startBin.index==6) moveNotOver=false;
		}
	}
	
	public static void distributeStones(){
		int hand=startBin.stoneCount;
		int location=startBin.index;
		startBin.stoneCount=0;
		while(hand>0){
			location++;
			if (location==13){
				location=0;
			}
			bins[location].stoneCount++;
			hand--;
		}
		startBin=bins[location];
	}
	
	public static void resetBoard(){
		for(Bin bin: bins){
			bin.stoneCount=4;
		}
		bins[6].stoneCount=0;
		
	}
}