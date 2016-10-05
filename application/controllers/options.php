<?php 

class Options extends CI_Controller{

	function __construct(){

		parent::__construct();
	}

	function get(){

		$options = $this->option->get();

		$data['json'] = json_encode( $options );

		$this->load->view('json/data', $data);
	}
}