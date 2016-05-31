package mancalaPackage;

import java.util.ArrayList;

public class Sequence {
	private static ArrayList<Integer> record = new ArrayList<Integer>();
	private String layout;
	private int potTotal;
	
	public static ArrayList<Integer> getRecord() {
		return record;
	}
	public static void setRecord(ArrayList<Integer> record) {
		Sequence.record = record;
	}
	public String getLayout() {
		return layout;
	}
	public void setLayout(String layout) {
		this.layout = layout;
	}
	public int getPotTotal() {
		return potTotal;
	}
	public void setPotTotal(int potTotal) {
		this.potTotal = potTotal;
	}
	
	
}
