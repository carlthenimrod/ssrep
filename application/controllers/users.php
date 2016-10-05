<?php 

class Users extends CI_Controller{

	function __construct(){

		parent::__construct();

		$this->load->model('user');
	}

	function index(){

		if( $this->input->post() ){

			$this->form_validation->set_rules('email', 'Email', 'trim|required');
			$this->form_validation->set_rules('password', 'Password', 'trim|required');

			//check to see if no fields are missing
			if($this->form_validation->run() ){

				$this->form_validation->set_rules('email', 'Email', 'callback_authorize_user[' . $this->input->post('password') . ']');

				//set error message
				$this->form_validation->set_message('authorize_user', 'Unable to login. User credentials incorrect.');

				//check to see if user exists
				if($this->form_validation->run() ){

					//get user
					$user = $this->user->get( $this->input->post('email') );

					//set session info
					$data = array(

						'id'        => $user->id,
						'name'      => $user->name,
						'email'     => $user->email,
						'logged_in' => true
					);

					$this->session->set_userdata($data);

					//redirect to admin
					redirect('admin');
				}
			}
		}

		$this->load->view('header');
		$this->load->view('user/login');
		$this->load->view('footer');
	}
	public function authorize_user($email, $password){

		return $this->user->validate($email, $password);
	}

	function logout(){

		$this->session->unset_userdata('id');
		$this->session->unset_userdata('email');
		$this->session->unset_userdata('logged_in');

		redirect('users');
	}
}